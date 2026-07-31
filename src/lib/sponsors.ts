export interface Sponsor {
  id: string;
  name: string;
  login?: string;
  avatarUrl: string;
  profileUrl: string;
  tier?: string;
  monthlyPriceInDollars?: number;
  isCustom?: boolean;
}

/**
 * Hardcoded custom sponsors list.
 * You can add custom non-GitHub sponsors, corporate partners, or special supporters here.
 */
export const CUSTOM_SPONSORS: Sponsor[] = [
  {
    id: "relational-throne",
    name: "Relational Throne",
    login: "xlelord9292",
    avatarUrl: "https://avatars.githubusercontent.com/u/140418730?v=4",
    profileUrl: "https://github.com/xlelord9292",
    tier: "Hardware Sponsor",
    isCustom: true,
  },
];

export async function getSponsors(): Promise<Sponsor[]> {
  const ghSponsors: Sponsor[] = [];

  try {
    const targetOrg = process.env.NEXT_PUBLIC_GITHUB_ORG || "jolterjs";

    if (process.env.GITHUB_TOKEN) {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              organization(login: "${targetOrg}") {
                sponsorshipsAsMaintainer(first: 100) {
                  nodes {
                    sponsorEntity {
                      ... on User {
                        login
                        name
                        avatarUrl
                        url
                      }
                      ... on Organization {
                        login
                        name
                        avatarUrl
                        url
                      }
                    }
                    tier {
                      name
                      monthlyPriceInDollars
                    }
                  }
                }
              }
            }
          `,
        }),
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const json = await res.json();
        const nodes =
          json.data?.organization?.sponsorshipsAsMaintainer?.nodes || [];
        for (const node of nodes) {
          const entity = node.sponsorEntity;
          if (entity) {
            ghSponsors.push({
              id: entity.login || entity.name,
              name: entity.name || entity.login,
              login: entity.login,
              avatarUrl: entity.avatarUrl,
              profileUrl: entity.url,
              tier:
                node.tier?.name ||
                (node.tier?.monthlyPriceInDollars
                  ? `$${node.tier.monthlyPriceInDollars}/mo`
                  : "Sponsor"),
              monthlyPriceInDollars: node.tier?.monthlyPriceInDollars,
              isCustom: false,
            });
          }
        }
      }
    } else {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(
        `https://ghs.sponsors.ghser.com/v0/sponsors/${targetOrg}`,
        {
          signal: controller.signal,
          next: { revalidate: 3600 },
        },
      ).catch(() => null);

      clearTimeout(timeoutId);

      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          for (const item of data) {
            const sponsor = item.sponsor || item;
            if (sponsor && (sponsor.login || sponsor.name)) {
              ghSponsors.push({
                id: sponsor.login || sponsor.name,
                name: sponsor.name || sponsor.login,
                login: sponsor.login,
                avatarUrl:
                  sponsor.avatarUrl ||
                  (sponsor.login
                    ? `https://github.com/${sponsor.login}.png`
                    : "https://github.com/github.png"),
                profileUrl:
                  sponsor.url ||
                  (sponsor.login
                    ? `https://github.com/${sponsor.login}`
                    : "https://github.com/sponsors/jolterjs"),
                tier: item.monthlyPriceInDollars
                  ? `$${item.monthlyPriceInDollars}/mo`
                  : "GitHub Sponsor",
                monthlyPriceInDollars: item.monthlyPriceInDollars,
                isCustom: false,
              });
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error fetching GitHub sponsors:", err);
  }

  // Merge hardcoded custom sponsors and GitHub sponsors
  const combined = [...CUSTOM_SPONSORS];

  for (const gh of ghSponsors) {
    if (
      !combined.some(
        (c) =>
          c.login &&
          gh.login &&
          c.login.toLowerCase() === gh.login.toLowerCase(),
      )
    ) {
      combined.push(gh);
    }
  }

  return combined;
}
