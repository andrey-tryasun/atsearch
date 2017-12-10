# atsearch
NodeJS command-line utility to search files

## Installation

``npm install -g atsearch``

## Usage:
    
##### CLI   

    Usage:
        atsearch [OPTION]=[ARG]
    
    Options: 
        --DIR (required) base lookup directory
        --TYPE (optional) [D|F]   D - directory, F - file
        --PATTERN (optional) regular expression to test file/directory name
        --MIN-SIZE (optional) minimum file size [B|K|M|G], skipped for directories
        --MAX-SIZE (optional) maximum file size [B|K|M|G], skipped for directories 
        
          (B - bytes, K - kilobytes, M - megabytes, G - gigabytes)

>Parameters order is not strict.

##### Examples:  

``atsearch --DIR="/User/Documents" --PATTERN=\.js``

``atsearch --DIR="/User/Documents" --TYPE=D``

``atsearch --PATTERN=\.mkv --TYPE=F --MIN-SIZE=4G --DIR="/User/Documents``


### License and Copyright
This software is released under the terms of the [ISC license](https://github.com/).
