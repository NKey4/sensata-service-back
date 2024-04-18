import OpenAI from "openai";
import AppealModel from "../models/Appeal.js";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ASSISTANT_ID = process.env.ASSISTANT_ID;

function removeLinks(text) {
  return text.replace(/【\d+:\d+†source】/g, "");
}
const create = async (req, res) => {
  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id: ASSISTANT_ID,
      thread: {
        messages: [
          {
            role: "user",
            content: req.body.appeal,
          },
        ],
      },
    });
    let messages;
    let answer;
    let question;
    do {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      messages = await openai.beta.threads.messages.list(run.thread_id);
      const userMessage = messages.data.find(
        (msg) => msg.role === "user" && msg.content && msg.content.length > 0
      );
      if (
        userMessage &&
        userMessage.content &&
        userMessage.content[0] &&
        userMessage.content[0].text
      ) {
        question = userMessage.content[0].text.value;
      }

      const assistantMessage = messages.data.find(
        (msg) =>
          msg.role === "assistant" && msg.content && msg.content.length > 0
      );
      if (
        assistantMessage &&
        assistantMessage.content &&
        assistantMessage.content[0] &&
        assistantMessage.content[0].text
      ) {
        answer = assistantMessage.content[0].text.value;
      }
    } while (!answer || !question);

    const newAppeal = new AppealModel({
      question,
      answer: removeLinks(answer),
      user: req.userId,
    });
    await newAppeal.save();
    res.json(newAppeal);
  } catch (error) {
    console.error("Ошибка сервера (appeal):", error);
  }
};

const getAll = async (req, res) => {
  try {
    const appeals = await AppealModel.find({ user: req.userId });
    res.json(appeals);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка в получении всех обращений",
    });
  }
};

const AppealControler = {
  create,
  getAll,
};

export default AppealControler;
