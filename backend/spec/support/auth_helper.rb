module AuthHelper
  def auth_headers(admin)
    token = Warden::JWTAuth::UserEncoder.new.call(admin, :admin, nil).first
    { 'Authorization' => "Bearer #{token}" }
  end
end
