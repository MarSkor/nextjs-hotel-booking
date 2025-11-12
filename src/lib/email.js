import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

/**
 *
 * @param {email} - Recipient Address
 * @param {subject} - Email Subject
 * @param {html} - HTML Content
 * @param {template} - Optional Template
 */

export const sendEmail = async ({ email, subject, html, template }) => {
  await qstashClient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken }),
    },
    body: {
      from: "Holidaze <contact@holidaze-project.martinelog.dev>",
      to: [email],
      subject,
      html,
      template,
    },
  });
};
