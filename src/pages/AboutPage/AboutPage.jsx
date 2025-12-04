import styles from "./AboutPage.module.css";
import { useEffect, useState } from "react";
import { api } from "../../api";

export default function AboutPage() {
  const [content, setContent] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setLoading(true);
      const result = await api.about.get();
      setContent(result.content);
    } catch (err) {
      setError("Failed to load information.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      await api.about.update({ content });
      setEditMode(false);
    } catch (err) {
      setError("Failed to update content.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1>About This URL Shortener</h1>

      {error && <p className={styles.error}>{error}</p>}

      {!editMode ? (
        <>
          <p className={styles.text}>{content}</p>

          {role === "Admin" && (
            <button
              className={styles.editBtn}
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}
        </>
      ) : (
        <>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className={styles.actions}>
            <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              className={styles.cancelBtn}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
