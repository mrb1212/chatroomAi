import { supabase } from '../lib/supabase';
import type { ChatMessage } from '../types';

// Get all messages for a chat
export async function getMessages(chatId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Get a single message by ID
export async function getMessage(messageId: string): Promise<ChatMessage | null> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', messageId)
    .single();

  if (error) throw error;
  return data;
}

// Create a new message
export async function createMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update an existing message
export async function updateMessage(
  messageId: string,
  updates: Partial<Omit<ChatMessage, 'id' | 'created_at'>>
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('messages')
    .update(updates)
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a message
export async function deleteMessage(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId);

  if (error) throw error;
}