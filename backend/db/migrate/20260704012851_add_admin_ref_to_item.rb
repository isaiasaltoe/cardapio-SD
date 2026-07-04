class AddAdminRefToItem < ActiveRecord::Migration[8.1]
  def change
    add_reference :items, :admin, null: false, foreign_key: true
  end
end
