import styles from "./UrlsPage.module.css";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { Link } from "react-router-dom";
import { urlSchema } from "../../schemas/urlSchema";

export default function UrlsPage() {
  const [urls, setUrls] = useState([]);
  const [originalUrl, setOriginalUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const token = localStorage.getItem("authToken");
  const currentUserId = Number(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");
  const redirectBase = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    loadUrls();
  }, []);

  function handleCopy(shortCode, id) {
    const fullUrl = `${redirectBase}/${shortCode}`;
    navigator.clipboard.writeText(fullUrl);

    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  }

  async function loadUrls() {
    try {
      setError("");
      const data = await api.urls.getAll();
      setUrls(data);
    } catch {
      setError("Failed to load URLs.");
    }
  }

  async function handleCreate(e) {
    e.preventDefault();

    try {
      await urlSchema.validate({ originalUrl }, { abortEarly: false });
      setError("");
    } catch (err) {
      setError(err.errors[0]);
      return;
    }

    try {
      setIsSubmitting(true);
      await api.urls.create({ originalUrl });
      setOriginalUrl("");
      loadUrls();
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response.data?.error || "This URL already exists.");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.error || "Validation error");
      } else {
        setError("Failed to create URL.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this URL?");
    if (!confirmDelete) return;

    try {
      await api.urls.delete(id);
      loadUrls();
    } catch {
      setError("Failed to delete URL.");
    }
  }

  function canDeleteUrl(ownerId) {
    return role === "Admin" || currentUserId === ownerId;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Short URLs</h1>

      {token && (
        <form className={styles.addForm} onSubmit={handleCreate}>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter URL to shorten"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
          <button className={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Shorten"}
          </button>
        </form>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {urls.length === 0 ? (
        <p className={styles.emptyState}>No URLs yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Original URL</th>
              <th className={styles.th}>Short URL</th>
              <th className={styles.th}>Info</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {urls.map((u) => (
              <tr key={u.id}>
                <td className={styles.td}>
                  <a href={u.originalUrl} target="_blank" rel="noreferrer">
                    {u.originalUrl}
                  </a>
                </td>

                <td className={styles.td}>
                  <a
                    href={`${redirectBase}/${u.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {u.shortCode}
                  </a>
                </td>

                <td className={styles.td}>
                  <Link className={styles.infoBtn} to={`/urls/${u.id}`}>
                    View
                  </Link>
                </td>

                <td className={styles.actionsTd}>
                  <div className={styles.actionsWrapper}>
                    <button
                      onClick={() => handleCopy(u.shortCode, u.id)}
                      className={styles.copyBtn}
                    >
                      {copiedId === u.id ? "Copied!" : "Copy"}
                    </button>

                    {canDeleteUrl(u.userId) && (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
