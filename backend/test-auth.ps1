$body = @{
  fullname = 'Final Test User'
  email = 'finaltest@example.com'
  password = 'testpass123'
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/register' -Method POST -Headers @{'Content-Type'='application/json'} -Body $body -UseBasicParsing
Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response:"
$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
