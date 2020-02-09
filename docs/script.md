## Running a script specified with ".kasaya" extension

### Sample script with set of commands
```
start
  launch "chrome"
  open "www.google.lk"
  type "cat"
  press "enter"
end  
```

### Sample script with a macro
```
how to runScript $browser $url $text $key
  launch $browser
  open $url
  type $text
  press $key
end

start
    runScript "chrome" "google.lk" "cat" "enter"
end    
```

### Run the script
```
kasaya script.kasaya
```
