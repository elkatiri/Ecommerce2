import React, { useState } from "react";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Group,
  Center,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Replace with your real authentication logic
    if (email === "admin@example.com" && password === "admin123") {
      // Redirect or set auth state
      alert("Login successful!");
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <Center style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        style={{ minWidth: 340, width: 340 }}
      >
        <Title order={2} align="center" mb="md">
          Admin Login
        </Title>
        <form onSubmit={handleLogin}>
          <TextInput
            label="Email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            mb="sm"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            mb="md"
          />
          {error && (
            <Text color="red" size="sm" mb="sm">
              {error}
            </Text>
          )}
          <Group position="apart" mt="md">
            <Button
              type="submit"
              fullWidth
              loading={loading}
              color="blue"
              radius="md"
            >
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}