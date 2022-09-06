import './App.css';
import { Grid } from '@mui/material';
import Summoner from './Summoner';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid
            flexDirection="column"
            alignItems="flex-start"
          >
            <Grid item>
              <Summoner num={1}/>
            </Grid>
            <Grid item>
              <Summoner num={2}/>
            </Grid>
            <Grid item>
              <Summoner num={3}/>
            </Grid>
            <Grid item>
              <Summoner num={4}/>
            </Grid>
            <Grid item>
              <Summoner num={5}/>
            </Grid>
          </Grid>
          <Grid
            flexDirection="column"
            alignItems="flex-end"
          >
            <Grid item>
              <Summoner num={6}/>
            </Grid>
            <Grid item>
              <Summoner num={7}/>
            </Grid>
            <Grid item>
              <Summoner num={8}/>
            </Grid>
            <Grid item>
              <Summoner num={9}/>
            </Grid>
            <Grid item>
              <Summoner num={10}/>
            </Grid>
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;
