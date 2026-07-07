require 'rails_helper'

RSpec.describe Admin, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      admin = build(:admin)
      expect(admin).to be_valid
    end

    it "is invalid without email" do
      admin = build(:admin, email: nil)
      expect(admin).not_to be_valid
    end

    it "is invalid without password" do
      admin = build(:admin, password: nil)
      expect(admin).not_to be_valid
    end

    it "is invalid with duplicate email" do
      create(:admin, email: "admin@teste.com")
      admin = build(:admin, email: "admin@teste.com")
      expect(admin).not_to be_valid
    end
  end

  describe "associations" do
    it "has many items" do
      association = described_class.reflect_on_association(:items)
      expect(association.macro).to eq(:has_many)
    end

    it "has many categories" do
      association = described_class.reflect_on_association(:categories)
      expect(association.macro).to eq(:has_many)
    end
  end
end
