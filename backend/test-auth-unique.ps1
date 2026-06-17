$body = @{
  fullname = 'Unique Register Test'
  email = "user$(Get-Random)@example.com"
  password = 'testpass123'
} | ConvertTo-Json

Write-Host "Testing new registration with random email..."
$response = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body $body -UseBasicParsing
Write-Host "✓ Status Code: $($response.StatusCode) - expected 201"
Write-Host "✓ Response:"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
