require 'rails_helper'

RSpec.describe Item, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      item = build(:item)
      expect(item).to be_valid
    end

    it "is invalid without name" do
      item = build(:item, name: nil)
      expect(item).not_to be_valid
      expect(item.errors[:name]).to include("can't be blank")
    end

    it "is invalid without description" do
      item = build(:item, description: nil)
      expect(item).not_to be_valid
      expect(item.errors[:description]).to include("can't be blank")
    end
  end
end
