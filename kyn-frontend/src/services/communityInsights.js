export const getCommunityInsights = async () => {
    try {
      const response = await fetch("/api/community-insights");
      if (!response.ok) {
        throw new Error("Failed to fetch community insights");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching community insights:", error);
      throw error;
    }
  };
  