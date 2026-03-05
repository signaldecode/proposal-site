import { createClient } from '@supabase/supabase-js';

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _client;
}

export async function uploadFile(
  path: string,
  file: Blob,
  contentType: string,
): Promise<string> {
  const client = getClient();
  const { error } = await client.storage
    .from('proposals')
    .upload(path, file, { contentType, upsert: true });

  if (error) throw new Error(`업로드 실패 (${path}): ${error.message}`);

  return client.storage.from('proposals').getPublicUrl(path).data.publicUrl;
}
