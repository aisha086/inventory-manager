export async function fetchRecipes(ingredients) {
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });
  
    const data = await response.json();
    if (data.error) {
      console.error(data.error);
      return [];
    }
  
    return data.suggestions;
  }
  