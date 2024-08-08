import React, { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import TemplateCard from './components/TemplateCard';
import './css/templates.css';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@emotion/react';
import TemplateModal from './components/TemplateModal';
const Templates = () => {
  const { get, post, put } = useAxios();
  const theme = useTheme();

  const [templates, setTemplates] = useState([]);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templateId, setTemplateId] = useState(undefined);

  const getAllTemplates = async () => {
    try {
      const result = await get('/templates');
      setTemplates(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTemplate = async (body) => {
    try {
      const result = await post('/templates', body);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTemplates();
  }, [templateModalOpen]);

  const updateTemplate = async (body) => {
    try {
      const result = await put('/template', body);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        height: '94%',
        width: '100%',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <h1 style={{ fontSize: '3rem' }}>Templates Page</h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          height: '100%',
          width: '100%',
          padding: '2rem',
          paddingRight: '5rem',
          paddingLeft: '5rem',
        }}
      >
        <div className="card" onClick={() => setTemplateModalOpen(true)}>
          <AddIcon fontSize="large" />
          <p style={{ width: '100%', textAlign: 'center' }}>Create Template</p>
        </div>
        {templates?.map((template) => {
          return (
            <TemplateCard
              key={Math.floor(Math.random())}
              templateName={template?.name}
              templateId={template?.id}
              onClick={(templateId) => {
                setTemplateId(templateId);
                setTemplateModalOpen(true);
              }}
            />
          );
        })}
      </div>

      {templateModalOpen && templateId === undefined && (
        <TemplateModal handleSave={(body) => createTemplate(body)} handleClose={() => setTemplateModalOpen(false)} />
      )}
      {templateModalOpen && templateId !== undefined && (
        <TemplateModal
          handleUpdate={(body) => {
            updateTemplate(body);
          }}
          handleClose={() => {
            setTemplateModalOpen(false);
            setTemplateId(undefined);
          }}
          templateId={templateId}
        />
      )}
    </div>
  );
};

export default Templates;
