class Item < ApplicationRecord
  validates :name, presence: true
  validates :description, presence: true
  belongs_to :category
  belongs_to :admin
  has_one_attached :photo
  validates :photo, content_type: ['image/png', 'image/jpeg'], size: { less_than: 5.megabytes}

end
