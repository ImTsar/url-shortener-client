import styles from "./LoginPage.module.css";
import { useState, useRef } from "react";
import { Form, useActionData, useSubmit } from "react-router-dom";
import { loginSchema } from "../../schemas/loginSchema";

export default function LoginPage() {
  const [errors, setErrors] = useState({});
  const actionData = useActionData();
  const formRef = useRef(null);
  const submit = useSubmit();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = formRef.current;
    const formData = Object.fromEntries(new FormData(form));

    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});
      submit(form);
    } catch (err) {
      const newErrors = {};
      err.inner?.forEach(e => (newErrors[e.path] = e.message));
      setErrors(newErrors);
    }
  };

  return (
    <div className={styles.LoginContainer}>
      <Form 
        ref={formRef} 
        method="post" 
        className={styles.LoginForm}
        onSubmit={handleSubmit}
      >
        <h2>Log In</h2>

        {actionData?.error && (
          <p className={styles.ServerError}>{actionData.error}</p>
        )}

        <input type="text" name="username" placeholder="Username" />
        {errors.username && <p className={styles.Error}>{errors.username}</p>}

        <input type="password" name="password" placeholder="Password" />
        {errors.password && <p className={styles.Error}>{errors.password}</p>}

        <button type="submit">Continue</button>
      </Form>
    </div>
  );
}
