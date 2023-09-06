` # \
# PowerShell Param statement : every line must end in #\ except the last line must with <#\
# And, you can't use backticks in this section        #\
param( $deployToServer, $deployToPath )              <#\
#^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ `
#vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
# Bash Start ------------------------------------------------------------

: ${deployToServer:="$1"}
: ${deployToPath:="$2"}
: ${deployToPath:="/usr/share/nginx/html/small-games/"}

rm -r dist/*
cp -r *.html *.png *.ico site.webmanifest robots.txt img css js dist/
echo "Copied:"
ls dist/
if [[ -n "$deployToServer" && -n "$deployToPath" ]] ; then

  echo "\nDeploy with scp to $deployToServer:$deployToPath ...\n"
  scp -r dist/* "$deployToServer":"$deployToPath"

else
  echo "\nPass parameters yourlogin@yourwebserver pathtodeploydirectory to deploy with scp\n"
fi

# Bash End --------------------------------------------------------------
# ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
echo > /dev/null <<"out-null" ###
'@ | out-null
#vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
# Powershell Start ----------------------------------------------------#>

Remove-Item dist/* -recurse -force
Copy-Item '*.html', '*.png', '*.ico', site.webmanifest, robots.txt, js, img, css -dest dist/ -recurse
echo "Copied:"
ls dist/
if( $deployToServer){
  if(-not $deployToPath){$deployToPath="/usr/share/nginx/html/small-games/"}

  echo "Deploy with scp... to $deployToServer`:$deployToPath"
  scp -r dist/* "$deployToServer`:$deployToPath"

}else{

  "`nPass parameters yourlogin@yourwebserver pathtodeploydirectory to deploy with scp`n"
}

# Powershell End -------------------------------------------------------
# ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
out-null
#vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
# Both Bash and Powershell run the rest but with limited capabilities

