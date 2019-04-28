### Resources for understanding node debugging via chrome and / or VScode
1) https://www.youtube.com/watch?v=hfpkMyvSOp4
2) https://code.visualstudio.com/docs/editor/variables-reference

#### `launch.json` cofiguration
```
"version": "0.2.0",
    "configurations": [
        //TYPE 1:  debug file that is in foreground
        {
            "type": "node",
            "request": "launch",
            "name": "debug file",  //name of config
            "program": "${file}",  // predefined variable
            "cwd": "${workspaceFolder}",  //folder that VS code has opened as root
        },

        //TYPE2:  debug specific  named files by path
        {
            "type": "node",
            "request": "launch",
            "name": "Launch index.js debug",
            "program": "${workspaceFolder}/Mutations&Subscriptions/src/index.js" 
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Launch app.js debug",
            "program": "${workspaceFolder}/debug/app.js"
        },

        //TYPE 3: attach to process (eg: Nodemon) -- see Mead video @~28:00 onwards, but not CLI commands have changed
        {
            "type": "node",
            "request": "attach",
            "name": "Attach nodemon process",
            "processId": "${command:PickProcess}",
            "port": 5858,
            "restart": true          // for use with nodemon
        },
    ]
}
```

__For attaching to a process:__
1. open terminal in the directory where the file you want to debug is
2. run `node --inspect-brk <<filename.js>>` or  `node --inspect-brk <<filename.js>>` .  Check the terminal to confirm debugger is attached.
3. switch over to vscode __debug__ pane, and make sure the file you are debugging is in the foregroud.  From the debug configurations dropdown, select "attach process to", and then...
    <ul>
        <li> if the `processID` property exists in the launch.json config for the attachment, then choose the process from the dropdown. 
        <li> If that property is not there, it should run immediately on file in the foreground.
        <li> hit the debug play button. check console for any logs that appear on script start
    </ul>
      
4.  open a browser tab and navigate to the local host server URL. 


