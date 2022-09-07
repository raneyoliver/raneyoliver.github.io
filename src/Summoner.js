import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import Summoners from './stats/summoners.txt'
import Stats from './stats/stats.txt'
import ImageNames from './stats/image_names.txt'
import Champions from './stats/champions.txt'
import { styled } from '@mui/material/styles';
const LCUConnector = require('lcu-connector');



const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    // backgroundColor: theme.palette.background.paper,
    fontSize: 11,
    backgroundColor: "rgba(30, 30, 30, 0)",
    color: "white",
    padding: theme.spacing(1),

  }));

function Summoner(props) {
    const [summoners, setSummoners] = useState([]);
    const [stats, setStats] = useState([]);
    const [imageNames, setImageNames] = useState([]);
    const [champions, setChampions] = useState([]);

    useEffect(() => {
        fetch(Summoners)
        .then((r) => r.text())
        .then(raw  => {
            setSummoners(raw.split(/\r?\n/));   // split by newline
        })
        fetch(Stats)
        .then((r) => r.text())
        .then(raw  => {
            setStats(raw.split(/\r?\n/));   // split by newline
        })
        fetch(ImageNames)
        .then((r) => r.text())
        .then(raw  => {
            setImageNames(raw.split(/\r?\n/));   // split by newline
        })
        fetch(Champions)
        .then((r) => r.text())
        .then(raw  => {
            setChampions(raw.split(/\r?\n/));   // split by newline
        })
    }, [])

    return (
        <Box style={{
            display: "flex",
            position: "relative",
        }}>
            <Paper
                className='summoner'
                sx={{
                    background: `url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${imageNames[props.num - 1]}_0.jpg) no-repeat`,
                    backgroundPositionX: "center",
                    backgroundPositionY: "top",
                    overflow: "hidden",
                    width: "25vw",
                    height: "14vh",
                    maxHeight: "180px",
                    ml: `${props.num <= 5 ? "3vw" : ""}`,
                    mr: `${props.num <= 5 ? "" : "3vw"}`,
                    my: "2vh",
                    position: "relative",
                    // outlineColor: "rgba(200, 200, 200, 1)",
                    // outlineWidth: "2px",
                    // outlineStyle: "solid"
                }}
                elevation={12}
            >
                {/* CHAMPION ICON */}
                {/* <img
                src={`http://ddragon.leagueoflegends.com/cdn/12.16.1/img/champion/${lines[(props.num * 3) - 1]}.png`}
                style={{position: "absolute", maxWidth: "7vh"}}
                /> */}
                
                {/* CHAMPION IMG */}
                {/* <img
                    class="example"
                    src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${lines[(props.num * 3) - 1]}_0.jpg`}
                    style={{minHeight: "100%", minWidth: "100%", objectFit: "none", objectPosition: "50% 10%", opacity: "50%"}}
                /> */}
                

                

                {/* CHAMP NAME */}
                <Paper style={{position: "absolute", top: "0", backgroundColor: "#282c34bb", right: "0"}}>
                    <Div className='detail'>
                        {champions[props.num - 1]}
                    </Div>
                </Paper>

                {/* SUMMONER NAME */}
                <Paper style={{position: "absolute", bottom: "0", backgroundColor: "#282c34bb"}}>
                    <Div className='detail'>
                        {summoners[props.num - 1] || ("Summoner " + props.num)}
                    </Div>
                </Paper>

                
            </Paper>

            {/* PLAYER STATS */}
            <Paper style={{
                backgroundColor: "#454a54",
                position: "absolute",
                height: "14vh",
                maxHeight: "180px",
                minWidth: "15vw",
                marginLeft: `${props.num <= 5 ? "1vw" : ""}`,
                marginRight: `${props.num <= 5 ? "" : "1vw"}`,
                left: `${props.num <= 5 ? "28vw" : ""}`,
                right: `${props.num <= 5 ? "" : "28vw"}`,
                top: "2vh",
                display: `${stats[props.num - 1] ? "normal" : "none"}`,
            }}
                className='detail'
            >
                <Div className='detail'>
                    {stats[props.num - 1]}
                </Div>
            </Paper>
        </Box>
    );
}

export default Summoner;
