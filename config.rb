require 'net/http'

# activate :directory_indexes

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
# configure :development do
#   activate :livereload
# end

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end
def isEnvironment environment
  ENV['RACK_ENV'] == environment
end

def isProduction? 
  isEnvironment "production"
end

def getShopifyProductByCollection collection_id
  ShopifyAPI::Product.find(:all, :params => {:collection_id => collection_id})
end

def initializeShopify 
  shop_url = "https://#{$SHOPIFY_API_KEY}:#{$SHOPIFY_API_PASSWORD}@#{$SHOPIFY_API_SHOP_NAME}.myshopify.com/admin"
  ShopifyAPI::Base.site = shop_url
end

def getRecentMedia user_id, access_token
      url = "https://api.instagram.com/v1/users/#{user_id}/media/recent/?access_token=#{access_token}&count=14"
      uri = URI.parse(url)
      request = Net::HTTP::Get.new(uri.request_uri)
      request.initialize_http_header({"Content-Type" => "application/json"})

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = (uri.port == 443 or uri.port == 4443)
      response =  http.request(request)
      response.body
end

$GOOGLE_API_KEY = 'AIzaSyCRlB_IGbIXk3WEEreLjAbYYOaq5SGHTC8'
ENVIRONMENT = ENV['RACK_ENV'] ||= 'development'
$BOOKING_ENDPOINT = isProduction? ? ENV['BOOKING_ENDPOINT'] : "http://sl-book.herokuapp.com/"

#shopify configurations
$SHOPIFY_API_KEY = isProduction? ? ENV['SHOPIFY_API_KEY'] : 'b5f953b408fcb211151d5ade657474aa'
$SHOPIFY_API_PASSWORD = isProduction? ? ENV['SHOPIFY_API_PASSWORD'] : '97a936e0bacda9064f2d400e63cd960e'
$SHOPIFY_API_SHOP_NAME = isProduction? ? ENV['SHOPIFY_API_SHOP_NAME'] : 'skinlaundry'
$SHOPIFY_BASE_URL = isProduction? ? ENV['SHOPIFY_BASE_URL'] : "http://shop.skinlaundry.com/"
$SHOPIFY_COLLECTIONS = {"shop" => 30578547, "featured_product" => 31145839, "4-step-system" => 31190943}

#Instagram credentials
$INSTAGRAM_CLIENT_ID = "a3c66eef02da48839c769383e50dca76"
$INSTAGRAM_CLIENT_SECRET = "0c3b270324be46b3accfcabfeb3737df"
$INSTAGRAM_ACCESS_TOKEN  = "356178582.a3c66ee.357c8838a9dc444bb8802a6acbff693a"
$INSTAGRAM_SL_USER_ID = 320927027

$COOKIE_DOMAIN = isProduction? ? ENV['COOKIE_DOMAIN'] : ""
$LOCATIONS_LIST = JSON.parse(File.read(ENV["MM_ROOT"] + "/jsons/stores.json"))

initializeShopify()
$INSTAFEED = JSON.parse getRecentMedia $INSTAGRAM_SL_USER_ID, $INSTAGRAM_ACCESS_TOKEN
$SHOPIFY_PRODUCTS = {}
$SHOPIFY_PRODUCTS["shop"] = getShopifyProductByCollection($SHOPIFY_COLLECTIONS['shop'])
$SHOPIFY_PRODUCTS["featured"] = getShopifyProductByCollection($SHOPIFY_COLLECTIONS['featured_product'])


set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

# Build-specific configuration
configure :build do

  # optimize images
  # activate :imageoptim 
  
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end

#Proxying for all the LOCATIONS list
$LOCATIONS_LIST["current"].each do |key, location|
  proxy "/locations/#{key}.html", "/location-single.html", :locals => { :location => location, :location_key => key }
  p "proxied url for #{key} location"
end
