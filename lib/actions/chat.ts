"use server"

// Simple mock for acceptChatRequest
export async function acceptChatRequest(chatId: string) {
    try {
        console.log(`Accepted chat session: ${chatId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
