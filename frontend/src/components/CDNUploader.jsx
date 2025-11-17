import { useState } from 'react';
import SectionCard from './SectionCard';
import { useAuth } from '../context/AuthContext';

function CDNUploader() {
  const { request } = useAuth();
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [objects, setObjects] = useState([]);
  const [error, setError] = useState('');

  const upload = async () => {
    if (!file) return;
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await request('/api/cdn/upload', { method: 'POST', data: formData });
      setUploadedFile(response);
      setFile(null);
      listObjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const listObjects = async () => {
    setError('');
    try {
      const data = await request('/api/cdn/files');
      setObjects(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SectionCard title="CDN & File Uploads" description="Upload assets to MinIO via the CDN service and list stored files.">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button className="btn" type="button" onClick={upload} disabled={!file}>
        Upload
      </button>
      <button className="btn secondary" type="button" onClick={listObjects} style={{ marginTop: '0.35rem' }}>
        List Files
      </button>

      {uploadedFile && (
        <div className="json-preview">
          <pre>{JSON.stringify(uploadedFile, null, 2)}</pre>
        </div>
      )}

      {objects.length > 0 && (
        <div className="list" style={{ marginTop: '0.75rem', maxHeight: 220, overflow: 'auto' }}>
          {objects.map((obj) => (
            <div key={obj.objectKey} className="list-item">
              <strong>{obj.objectKey}</strong>
              <div style={{ wordBreak: 'break-all' }}>
                <a href={obj.url} target="_blank" rel="noreferrer">
                  {obj.url}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
    </SectionCard>
  );
}

export default CDNUploader;
