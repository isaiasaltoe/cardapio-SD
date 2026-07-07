FactoryBot.define do
  factory :item do
    name { Faker::Food.dish }
    description { Faker::Food.description }
    value { Faker::Commerce.price(range: 5.0..100.0) }

    association :category
    association :admin
  end
end
