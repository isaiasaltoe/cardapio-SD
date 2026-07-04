class Category < ApplicationRecord
  has_many :items, dependent: :destroy
  belongs_to :admin
end
