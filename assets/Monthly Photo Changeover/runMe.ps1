# Get the directory where the script is located
$scriptDirectory = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition

# Function to get all file names in the script's directory recursively and organize by folder
function Get-FilesByFolder {
    param (
        [Parameter(Mandatory = $true)]
        [string]$FolderPath
    )
    Get-ChildItem -Path $FolderPath -File -Recurse | Group-Object Directory | ForEach-Object {
        [PSCustomObject]@{
            FolderName = $_.Name.Split('\')[-1]
            Files = $_.Group.Name
        }
    } | ConvertTo-Json
}

# Get files organized by folder in the script's directory
$foldersData = Get-FilesByFolder -FolderPath $scriptDirectory

# Define the variable assignment in JavaScript format
$javascriptContent = "var folderData = $foldersData;"

# Save the JavaScript content to a .js file relative to the script's location
$jsFilePath = Join-Path -Path $scriptDirectory -ChildPath ".././js/output.js"
$javascriptContent | Out-File -FilePath $jsFilePath -Encoding utf8
