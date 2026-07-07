FactoryBot.define do
  factory :admin do
    email { Faker::Internet.email }
    password { "flamengo" }
  end
end
