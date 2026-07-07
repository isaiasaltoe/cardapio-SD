class Category < ApplicationRecord
  has_many :items, dependent: :destroy
  belongs_to :admin
  validates :name, presence: true
end
