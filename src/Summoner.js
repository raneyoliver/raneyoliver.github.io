import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import description from './description.txt';
import { styled } from '@mui/material/styles';



const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    // backgroundColor: theme.palette.background.paper,
    fontSize: 11,
    backgroundColor: "rgba(30, 30, 30, 0)",
    color: "white",
    padding: theme.spacing(1),

  }));

function Summoner(props) {
    const [lines, setLines] = useState([]);
    const [summoners, setSummoners] = useState([]);

    useEffect(() => {
        fetch(description)
        .then((r) => r.text())
        .then(raw  => {
            setLines(raw.split(/\r?\n/));   // split by newline
            //console.log(summoners);
            setSummoners(raw.split("^"));
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
                    //background: `url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${lines[(props.num * 5) - 3]}_0.jpg) no-repeat`,
                    backgroundSize: "125% auto",
                    overflow: "hidden",
                    width: "25vw",
                    height: "14vh",
                    maxHeight: "180px",
                    ml: `${props.num <= 5 ? "3vw" : ""}`,
                    mr: `${props.num <= 5 ? "" : "3vw"}`,
                    my: "2vh",
                    position: "relative"
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
                        {lines[(props.num * 5) - 2]}
                    </Div>
                </Paper>

                {/* SUMMONER NAME */}
                <Paper style={{position: "absolute", bottom: "0", backgroundColor: "#282c34bb"}}>
                    <Div className='detail'>
                        {lines[(props.num * 5) - 5] || ("Summoner " + props.num)}
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
                display: `${lines[(props.num * 5) - 4] ? "normal" : "none"}`
            }}
                className='detail'
            >
                <Div className='detail'>
                    {lines[(props.num * 5) - 4]}
                </Div>
            </Paper>
        </Box>
    );
}

export default Summoner;
