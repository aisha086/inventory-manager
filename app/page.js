'use client'
import { firestore } from "@/firebase";
import { useState, useEffect } from "react";
import { collection, doc, getDocs, query, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { Box, Button, Modal, Stack, TextField, Typography, Fade } from '@mui/material';
import {styled} from '@mui/material/styles'
import RecipeList from '../components/RecipeList';
import { fetchRecipes } from '../lib/fetchRecipes';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeSuggestions, setRecipeSuggestions] = useState([]);

  const handleGetRecipes = async () => {
    const ingredients = inventory.map(item => item.name);
    const recipes = await fetchRecipes(ingredients);
    setRecipeSuggestions(recipes);
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setInventory(inventoryList)
  }

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeItems = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      }
      else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory();
  }

  const addItems = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();

      await setDoc(docRef, { quantity: quantity + 1 })
    }
    else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory();
  }

  useEffect(() => {
    updateInventory()
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const GradientHeading = styled(Typography)(({ theme }) => ({
    fontSize: '4rem', // Adjust font size as needed
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #433D8B, #B0B0B0)', // Gradient background
    WebkitBackgroundClip: 'text', // Clip background to text
    color: 'transparent', // Make text color transparent to show gradient
    textAlign: 'center',
    padding: theme.spacing(2),
  }));

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="#FFFFFF"
    >

      <Modal open={open} onClose={handleClose}>
        <Fade in={open}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            bgcolor="#ffffff"
            borderRadius={2}
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ 
              transform: 'translate(-50%, -50%)', 
              border: 5, 
              borderColor: "#433D8B",
              width: {xs: "300px", md:"400px"}
            }}
          >
            <Typography variant="h6" color="#433D8B">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{ input: { color: '#433D8B' }, fieldset: { borderColor: '#433D8B' } }}
              />
              <Button
                variant="contained"
                color="secondary"
                sx={{backgroundColor: "#433D8B"}}
                onClick={() => {
                  addItems(itemName);
                  setItemName('');
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      <Box
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        flexDirection: {xs: "column", md: "row"}
      }}
      >
        <GradientHeading variant="h1">
        Pantry Manager
        </GradientHeading>
        <Button
          variant="contained"
         
          onClick={() => handleOpen()}
          sx={{ backgroundColor: "#433D8B", mb: {xs: 2, md: 0}}}
        >
          Add New Item
        </Button>
      
      </Box>

      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#fffff"
        my={5}
      >
      <Box 
        width="80%"
        maxWidth="1200px"
        borderRadius={2}
        boxShadow={3}
      >
        <TextField
          variant="outlined"
          width= "80%"
          fullWidth
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ input: { color: '#433D8B' }, fieldset: { borderColor: '#433D8B', } }}
        />
      </Box>
      </Box>
      <Box
        width="100%"
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        bgcolor="#fffff"
      >
        <Box
          width="80%"
          maxWidth="1200px"
          bgcolor="#433D8B"
          borderRadius={2}
          boxShadow={3}
          p={3}
        >
          <Box
            width="100%"
            bgcolor="#FFFFFF"
            borderRadius={1}
            p={2}
            mb={2}
          >
            <Typography variant="h3" align="center" color="#433D8B">Items</Typography>
          </Box>
          <Stack spacing={2}>
          
            {filteredInventory.map(({ name, quantity }) => (
          
              <Fade key={name} in>
                <Box
                  width="100%"
                  bgcolor="#ffffff"
                  borderRadius={1}
                  boxShadow={1}
                  p={3}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    flexDirection: {xs: "column", md: "row"}
                  }}
                >
                  <Typography variant="h6" color="#433D8B">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6" color="#433D8B">
                    Quantity: {quantity}
                  </Typography>
                  <Stack 
                  direction="row" 
                  spacing={2}
                  sx={{
                    m: 2
                  }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => addItems(name)}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => removeItems(name)}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            ))}
          </Stack>
        </Box>
      </Box>
      <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#fffff"
      my={5}
      >
      <Box 
      width="80%"
      maxWidth="1200px"
      borderRadius={2}
      boxShadow={3}
      display="flex"
      flexDirection="column"
      alignContent="center"
      justifyContent="center"
      >
    
      <Button
        variant="contained"
        color="primary"
        onClick={handleGetRecipes}
        sx={{ backgroundColor: "#433D8B", mb: { xs: 2, md: 0 } }}
      >
        Get Recipe Suggestions
      </Button>
      {recipeSuggestions.length > 0 && (
        <Box mt={2} >
          <Typography variant="h6" color="#433D8B">Recipe Suggestions:</Typography>
          <RecipeList recipes={recipeSuggestions} />
        </Box>
      )}
    </Box>
    </Box>
    </Box>
  );
}

