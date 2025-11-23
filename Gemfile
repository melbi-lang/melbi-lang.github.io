source "https://rubygems.org"

# github-pages >= 232 depends on jekyll = 3.10.0
gem "jekyll", "~> 4.4.1" # Pick a Jekyll version (static site generator)

# gem "minima", "~> 2.5"  # A minimal Jekyll theme
gem "just-the-docs", "0.10.1" # Jekyll theme (pinned version)

# gem "github-pages", "~> 232", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17.0"
  gem "jekyll-seo-tag", "~> 2.8.0"
  gem "jekyll-sitemap", "~> 1.4.0"
  gem "jekyll-toc", "~> 0.19.0"
end

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
