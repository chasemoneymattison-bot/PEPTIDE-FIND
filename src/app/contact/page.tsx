"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/toaster";

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      toast("Please fill in all fields", "error");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSent(true);
        toast(data.message || "Message sent!", "success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast(data.error || "Failed to send message", "error");
      }
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-4xl font-bold">Contact Us</h1>
      <p className="mb-8 text-muted-foreground">
        Have a question or feedback? We&apos;d love to hear from you.
      </p>

      {sent ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
            <h2 className="mb-2 text-2xl font-bold">Message Sent!</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
              Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
            </p>
            <Button onClick={() => setSent(false)} variant="outline">
              Send Another Message
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send us a message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Subject</label>
                <Input
                  value={form.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  placeholder="What is this about?"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  rows={5}
                  placeholder="Tell us more..."
                  required
                  maxLength={5000}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {form.message.length}/5000 characters
                </p>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={sending}>
                <Send className="h-4 w-4" />
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 text-center">
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          Or email us directly at{" "}
          <a
            href="mailto:support@peptidefind.com"
            className="text-accent hover:underline"
          >
            support@peptidefind.com
          </a>
        </p>
      </div>
    </div>
  );
}
