
Pod::Spec.new do |s|
  s.name         = "RNCzPanel"
  s.version      = "0.0.1"
  s.summary      = "RNCzPanel"
  s.description  = "RN 显示各种信息的仪表图"
  s.homepage     = "https://github.com/chenzhe555/react-native-cz-panel"
  s.license    = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author       = { "author" => "376811578@qq.com" }
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/author/RNCzPanel.git", :tag => s.version }
  s.source_files  = "*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  