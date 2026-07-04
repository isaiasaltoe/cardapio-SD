class Item < ApplicationRecord
  validates :name, presence: true
  validates :description, presence: true
  belongs_to :category
  belongs_to :admin
end
