require 'rails_helper'

RSpec.describe Category, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      category = build(:category)
      expect(category).to be_valid
    end
  end

  describe "associations" do
    it "belongs to admin" do
      association = described_class.reflect_on_association(:admin)
      expect(association.macro).to eq(:belongs_to)
    end

    it "has many items" do
      association = described_class.reflect_on_association(:items)
      expect(association.macro).to eq(:has_many)
    end
  end
end
