import styles from "./UrlInfoPage.module.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api";

export default function UrlInfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const redirectBase = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    loadUrlInfo();
  }, []);

  async function loadUrlInfo() {
    try {
      const url = await api.urls.getById(id);
      setData(url);
    } catch (err) {
      setError("Failed to load URL details.");
    }
  }

  function handleBack() {
    navigate("/urls");
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={handleBack}>← Back</button>

      <h1 className={styles.title}>URL Details</h1>

      {error && <p className={styles.error}>{error}</p>}

      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.label}>Original URL:</span>
            <a href={data.originalUrl} target="_blank" rel="noreferrer" className={styles.value}>
              {data.originalUrl}
            </a>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Short URL:</span>
            <a 
              href={`${redirectBase}/${data.shortCode}`} 
              target="_blank" 
              rel="noreferrer" 
              className={styles.shortLink}
            >
              {redirectBase}/{data.shortCode}
            </a>
          </div>

          {data.ownerName && (
            <div className={styles.row}>
              <span className={styles.label}>Owner:</span>
              <span className={styles.value}>{data.ownerName}</span>
            </div>
          )}

          {data.createdAt && (
            <div className={styles.row}>
              <span className={styles.label}>Created:</span>
              <span className={styles.value}>
                {new Date(data.createdAt).toLocaleString()}
              </span>
            </div>
          )}

          <div className={styles.infoBox}>
            <p>This short URL will redirect users to the original link.</p>
          </div>
        </div>
      )}
    </div>
  );
}
