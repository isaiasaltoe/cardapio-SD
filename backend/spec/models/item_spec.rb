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

    it "is valid with a photo attached" do
      item = build(:item)
      item.photo.attach(
        io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'test_image.jpg')),
        filename: 'test_image.jpg',
        content_type: 'image/jpeg'
      )
      expect(item).to be_valid
    end

    it "is invalid with a non-image photo attached" do
      item = build(:item)
      item.photo.attach(
        io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'test_document.pdf')),
        filename: 'test_document.pdf',
        content_type: 'application/pdf'
      )
      expect(item).not_to be_valid
    end
  end
end
