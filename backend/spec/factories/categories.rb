FactoryBot.define do
  factory :category do
    name { Faker::Commerce.department }
    association :admin
  end
end
