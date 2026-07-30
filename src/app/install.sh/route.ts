import { fetchGitHubScript } from "@/lib/fetch-script";

export async function GET() {
  return fetchGitHubScript("install.sh");
}
