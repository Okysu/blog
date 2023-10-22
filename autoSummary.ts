import fs from "fs";
import path from "path";
import matter from "gray-matter";
import consola from "consola";

// get OpenAI Config from the environment variables
var openaiConfig = {
  baseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com",
  apiKey: process.env.OPENAI_API_KEY,
  prompt:
    "你是一个文章摘要生成助手，你要根据用户所提供的文章进行摘要，但你不需要提出建议和进行文本换行，仅仅对内容进行摘要即可。总计内容大150字左右。",
};

if (!openaiConfig.apiKey) {
  consola.error("OPENAI_API_KEY is not set");
  process.exit(1);
}

const generateAutoSummary = async (content: string): Promise<string> => {
  if (openaiConfig.baseUrl.endsWith("/")) {
    openaiConfig.baseUrl = openaiConfig.baseUrl.slice(0, -1);
  }
  const url = `${openaiConfig.baseUrl}/v1/chat/completions`;
  const prompt = [
    {
      role: "system",
      content: openaiConfig.prompt,
    },
    {
      role: "user",
      content: content,
    },
  ];

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${openaiConfig.apiKey}`,
  };

  const data = {
    model: "gpt-3.5-turbo",
    messages: prompt,
    max_tokens: 250,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0.3,
    stop: ["\n"],
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = (await response.json()) as any;
  return result.choices[0].message.content;
};

export function startAISummary() {
  // get the current working directory
  var currentDir = process.cwd();
  var postsDir = path.join(currentDir, "pages/posts");

  // read all the posts
  var posts = fs.readdirSync(postsDir);

  // loop through each post
  posts.forEach((post) => {
    const postContent = fs.readFileSync(path.join(postsDir, post), "utf-8");
    const { data, content } = matter(postContent);
    // if data.excerpt is not present and data.excerpt_type is ai then generate the excerpt
    const shouldGenerateExcerpt = !data.excerpt && data.excerpt_type === "ai";

    if (shouldGenerateExcerpt) {
      consola.log(`Generating excerpt for ${post}`);
      generateAutoSummary(content)
        .then((excerpt) => {
          consola.log(`Generated excerpt for ${post}`);
          // add the excerpt to the post data
          data.excerpt = excerpt;
          // add the excerpt to the post content
          const newPostContent = matter.stringify(content, data);
          // write the new post content to the file
          fs.writeFileSync(path.join(postsDir, post), newPostContent);
        })
        .catch((error) => {
          consola.error(`Error generating excerpt for ${post}`);
          consola.error(error);
        });
    }
  });
}
