import React, { useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
  IconButton,
  Toolbar,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Chat as ChatIcon,
  Description as DescriptionIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../layouts/Sidebar.tsx';
import ChatArea from './ChatArea.tsx';
import DocumentPanel from '../../documents/components/DocumentPanel.tsx';

const DRAWER_WIDTH = 300;
const DRAWER_COLLAPSED_WIDTH = 60;
const DOCUMENT_PANEL_WIDTH = 340;
const DOCUMENT_PANEL_COLLAPSED_WIDTH = 60;
const MIN_DRAWER_WIDTH = 240;
const MAX_DRAWER_WIDTH = 500;
const MIN_DOCUMENT_PANEL_WIDTH = 280;
const MAX_DOCUMENT_PANEL_WIDTH = 600;

export const ChatLayout: React.FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [documentPanelCollapsed, setDocumentPanelCollapsed] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(DRAWER_WIDTH);
  const [documentPanelWidth, setDocumentPanelWidth] = useState(DOCUMENT_PANEL_WIDTH);
  const isDraggingDrawer = useRef(false);
  const isDraggingDocPanel = useRef(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleDocumentPanelToggle = () => {
    setDocumentPanelCollapsed(!documentPanelCollapsed);
  };

  const handleDrawerMouseDown = useCallback(() => {
    isDraggingDrawer.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleDocPanelMouseDown = useCallback(() => {
    isDraggingDocPanel.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDraggingDrawer.current) {
        const newWidth = e.clientX;
        if (newWidth >= MIN_DRAWER_WIDTH && newWidth <= MAX_DRAWER_WIDTH) {
          setDrawerWidth(newWidth);
        }
      }
      if (isDraggingDocPanel.current) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= MIN_DOCUMENT_PANEL_WIDTH && newWidth <= MAX_DOCUMENT_PANEL_WIDTH) {
          setDocumentPanelWidth(newWidth);
        }
      }
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    if (isDraggingDrawer.current || isDraggingDocPanel.current) {
      isDraggingDrawer.current = false;
      isDraggingDocPanel.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'grey.50' }}>
      <Navbar onMenuClick={handleDrawerToggle} showMenuButton={isMobile} />

      <Box
        component="nav"
        sx={{
          width: { md: sidebarCollapsed ? DRAWER_COLLAPSED_WIDTH : drawerWidth },
          flexShrink: { md: 0 },
          transition: sidebarCollapsed ? 'width 0.3s ease' : 'none',
          position: 'relative',
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
                border: 'none',
                boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
              },
            }}
          >
            <Toolbar />
            <Sidebar onClose={handleDrawerToggle} />
          </Drawer>
        ) : (
          <>
            <Drawer
              variant="permanent"
              sx={{
                '& .MuiDrawer-paper': {
                  width: sidebarCollapsed ? DRAWER_COLLAPSED_WIDTH : drawerWidth,
                  boxSizing: 'border-box',
                  border: 'none',
                  boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
                  transition: sidebarCollapsed ? 'width 0.3s ease' : 'none',
                  overflowX: 'hidden',
                },
              }}
              open
            >
              <Toolbar />
              {sidebarCollapsed ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 2,
                  }}
                >
                  <IconButton
                    onClick={handleSidebarToggle}
                    sx={{
                      mb: 2,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    <ChatIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box>
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <IconButton
                      onClick={handleSidebarToggle}
                      size="small"
                      sx={{
                        bgcolor: 'grey.100',
                        '&:hover': {
                          bgcolor: 'grey.200',
                        },
                      }}
                    >
                      <ChevronLeftIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Sidebar />
                </Box>
              )}
            </Drawer>
            {!sidebarCollapsed && (
              <Box
                onMouseDown={handleDrawerMouseDown}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '4px',
                  cursor: 'ew-resize',
                  bgcolor: 'transparent',
                  zIndex: 1300,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                  '&:active': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <DragIndicatorIcon
                    sx={{
                      fontSize: 16,
                      color: 'grey.400',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          mt: '64px',
          overflow: 'hidden',
        }}
      >
        <ChatArea sessionId={sessionId} onMenuClick={isMobile ? handleDrawerToggle : undefined} />
      </Box>

      <Box
        sx={{
          width: { xs: 0, lg: documentPanelCollapsed ? DOCUMENT_PANEL_COLLAPSED_WIDTH : documentPanelWidth },
          display: { xs: 'none', lg: 'block' },
          mt: '64px',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.08)',
          bgcolor: 'white',
          transition: documentPanelCollapsed ? 'width 0.3s ease' : 'none',
          overflowX: 'hidden',
          position: 'relative',
        }}
      >
        {!documentPanelCollapsed && (
          <Box
            onMouseDown={handleDocPanelMouseDown}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '4px',
              cursor: 'ew-resize',
              bgcolor: 'transparent',
              zIndex: 1300,
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: 'primary.main',
              },
              '&:active': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            >
              <DragIndicatorIcon
                sx={{
                  fontSize: 16,
                  color: 'grey.400',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              />
            </Box>
          </Box>
        )}
        {documentPanelCollapsed ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 2,
            }}
          >
            <IconButton
              onClick={handleDocumentPanelToggle}
              sx={{
                mb: 2,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              sx={{
                color: 'text.secondary',
              }}
            >
              <DescriptionIcon />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'flex-start',
              }}
            >
              <IconButton
                onClick={handleDocumentPanelToggle}
                size="small"
                sx={{
                  bgcolor: 'grey.100',
                  '&:hover': {
                    bgcolor: 'grey.200',
                  },
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
              <DocumentPanel sessionId={sessionId} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatLayout;
