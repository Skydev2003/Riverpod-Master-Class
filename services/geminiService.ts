import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const askGeminiTutor = async (
  question: string, 
  currentContext: string,
  codeContext: string
): Promise<string> => {
  if (!apiKey) {
    return "ไม่พบ API Key กรุณาตั้งค่า API Key ใน Environment Variable";
  }

  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `
      คุณคือผู้เชี่ยวชาญด้าน Flutter และ Riverpod ที่เก่งมาก
      หน้าที่ของคุณคือสอนนักเรียนไทย
      
      บริบทบทเรียนปัจจุบัน: ${currentContext}
      โค้ดตัวอย่างปัจจุบัน: ${codeContext}
      
      คำแนะนำ:
      1. ตอบคำถามเป็นภาษาไทยที่เข้าใจง่าย กระชับ
      2. อ้างอิงโค้ดตัวอย่างถ้าจำเป็น
      3. เน้น Best Practice ของ Riverpod 2.0+
      4. ถ้าผู้ใช้ถามนอกเรื่อง ให้พยายามโยงกลับมาเรื่อง Flutter หรือ Riverpod อย่างนุ่มนวล
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: 'user',
          parts: [{ text: `System Instruction: ${systemInstruction}\n\nQuestion: ${question}` }]
        }
      ],
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "ขออภัย ไม่สามารถประมวลผลคำตอบได้ในขณะนี้";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI Tutor";
  }
};