/// <reference types="vite/client" />

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Layout, Input, Button, message, List, Avatar, Tabs } from 'antd';
import MonacoEditor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import { MessageContent } from '../components/message-content';
import { SYSTEM_PROMPT, SYSTEM_MODEL } from '../constants/index';
import { getPageDetail, savePage, PageData } from '../services/page';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface StreamChunk {
  id: string;
  choices: {
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason: string | null;
    index: number;
  }[];
  created: number;
  model: string;
  object: string;
}

const PageCreator: React.FC = () => {
  const { pageName } = useParams();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system' as const, content: SYSTEM_PROMPT }
  ]);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<Message | null>(null);
  const [prompt, setPrompt] = useState('');
  const [pageInfo, setPageInfo] = useState<PageData>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const abortControllerRef = useRef<AbortController | null>(null);

  // 加载页面数据
  useEffect(() => {

    const loadPage = async () => {
        console.log("loadPage",pageName);
      if (!pageName) return;
      
      try {
        setLoading(true);
        const response = await getPageDetail(pageName);
        setCode(response.data.content);
        setPageInfo(response.data);
      } catch (error) {
        console.error('加载页面失败:', error);
        message.error('加载页面失败');
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [pageName]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
    setCurrentStreamingMessage(null);
  }, []);

  const appendToLastMessage = useCallback((content: string) => {
    setCurrentStreamingMessage(prev => {
      const newContent = prev ? prev.content + content : content;
      return {
        role: 'assistant',
        content: newContent
      };
    });
  }, []);

  const processStreamChunk = useCallback((chunk: string) => {
    if (chunk.trim() === '') return;
    if (chunk === 'data: [DONE]') {
      if (currentStreamingMessage) {
        addMessage(currentStreamingMessage);
      }
      return;
    }

    const data = chunk.replace(/^data: /, '');
    try {
      const parsed: StreamChunk = JSON.parse(data);
      const content = parsed.choices[0].delta.content;
      if (content) {
        appendToLastMessage(content);
      }
    } catch (e) {
      console.error('解析流式响应失败:', e);
    }
  }, [appendToLastMessage, addMessage, currentStreamingMessage]);

  const handleGenerate = async () => {
    if (!prompt) {
      message.warning('请输入页面描述');
      return;
    }

    // 如果存在之前的请求，取消它
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setLoading(true);
    setCurrentStreamingMessage(null);
    abortControllerRef.current = new AbortController();

    try {
      // 添加用户消息
      const userMessage: Message = { role: 'user', content: prompt };
      addMessage(userMessage);

      // 创建响应处理器
      const response = await fetch(`${import.meta.env.VITE_DEEPSEEK_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          model: SYSTEM_MODEL,
          messages: [...messages, userMessage],
          temperature: 0.7,
          topP: 0.9,
          topK: 50,
          max_tokens: 2000,
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (!reader) {
        throw new Error('无法获取响应流');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          processStreamChunk(line);
        }
      }

      // 处理最后的缓冲区内容
      if (buffer) {
        processStreamChunk(buffer);
      }

      message.success('代码生成成功');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('请求被取消');
      } else {
        console.error('API调用失败:', error);
        message.error('代码生成失败');
      }
    } finally {
      setLoading(false);
      setPrompt('');
      abortControllerRef.current = null;
    }
  };

  const handleSave = async () => {
    if (!pageName || !code) {
      message.warning('请先生成或编辑代码');
      return;
    }

    try {
      setLoading(true);
      if(pageInfo){
        await savePage(pageName, {
            ...pageInfo,
            content: code || '',
          });
          message.success('保存成功');
      }
      
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeBlock = useCallback((code: string, language: string) => {
    if (language === 'html') {
      setCode(code);
    }
  }, []);

  const PreviewComponent = code ? () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(code);
          iframeDoc.close();
        }
      }
    }, [code]);

    return (
      <iframe
        ref={iframeRef}
        style={{
          width: '100%',
          height: 'calc(100vh - 150px)',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          backgroundColor: '#fff'
        }}
        title="页面预览"
      />
    );
  } : null;

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 16 }}>
          页面设计器 - {pageInfo?.title}
        </div>
        <Button type="primary" onClick={handleSave}>
          保存
        </Button>
      </Header>
      <Layout>
        <Sider width={400} style={{ background: '#fff', padding: 16 }}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <List
              style={{ flex: 1, overflow: 'auto', marginBottom: 16 }}
              itemLayout="horizontal"
              dataSource={[...messages.filter(msg => msg.role !== 'system'), 
                         ...(currentStreamingMessage ? [currentStreamingMessage] : [])]}
              renderItem={(msg, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: msg.role === 'user' ? '#1890ff' : '#52c41a' }}
                      >
                        {msg.role === 'user' ? 'U' : 'AI'}
                      </Avatar>
                    }
                    description={
                      msg.role === 'assistant' ? (
                        <MessageContent 
                          content={msg.content} 
                          onCodeBlock={handleCodeBlock}
                        />
                      ) : (
                        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.content}</pre>
                      )
                    }
                  />
                </List.Item>
              )}
            />
            <div>
              <Input.TextArea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="请输入页面描述，AI将根据描述生成页面代码"
                rows={4}
                style={{ marginBottom: 16 }}
              />
              <Button
                type="primary"
                block
                onClick={handleGenerate}
                loading={loading}
              >
                生成代码
              </Button>
            </div>
          </div>
        </Sider>
        <Content style={{ padding: 16, background: '#fff', margin: '0 16px' }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="代码编辑" key="1">
              <MonacoEditor
                height="calc(100vh - 150px)"
                language="html"
                theme="vs-dark"
                value={code}
                onChange={value => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  automaticLayout: true,
                }}
              />
            </TabPane>
            <TabPane tab="页面预览" key="2">
              {PreviewComponent && (
                <PreviewComponent />
              )}
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PageCreator; 