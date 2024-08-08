import { List, ListItem, Box,Typography, Link } from '@mui/material';

const RecipeList = ({ recipes }) => {
  return (
    <List>
      {recipes.map((item, index) => (
        <ListItem key={index}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography variant="body1" sx={{ flex: 1 }}>
              {item.recipe}
            </Typography>
            {item.url && (
              <Link href={item.url} target="_blank" rel="noopener noreferrer" sx={{ ml: 2 }}>
                View Recipe
              </Link>
            )}
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default RecipeList;
