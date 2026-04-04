/**
 * Curated .gitignore fragments for common stacks. Merge order prefers OS and
 * editors first, then languages and infra. Users should still review output.
 */

export type GitignoreTemplateId =
  | "macos"
  | "windows"
  | "linux"
  | "node"
  | "nextjs"
  | "python"
  | "rust"
  | "go"
  | "java"
  | "ruby"
  | "php"
  | "dotnet"
  | "terraform"
  | "docker"
  | "vscode"
  | "jetbrains"
  | "vue"
  | "swift-xcode"
  | "flutter"
  | "c-cpp"
  | "kubernetes";

export type GitignoreTemplateMeta = {
  id: GitignoreTemplateId;
  label: string;
  short: string;
  body: string;
};

export const GITIGNORE_TEMPLATE_LIST: GitignoreTemplateMeta[] = [
  {
    id: "macos",
    label: "macOS",
    short: ".DS_Store, AppleDouble, etc.",
    body: `.DS_Store
.AppleDouble
.LSOverride
Icon
._*
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent`,
  },
  {
    id: "windows",
    label: "Windows",
    short: "Thumbs.db, desktop.ini",
    body: `Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db
*.stackdump
[Dd]esktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msix
*.msm
*.msp
*.lnk`,
  },
  {
    id: "linux",
    label: "Linux",
    short: "backup and temp files",
    body: `*~
.fuse_hidden*
.directory
.Trash-*
.nfs*`,
  },
  {
    id: "node",
    label: "Node.js / JavaScript",
    short: "node_modules, logs, caches",
    body: `node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*
.npm
.eslintcache
.node_repl_history
*.tgz
.yarn-integrity
.parcel-cache/
.cache/
.turbo/
*.tsbuildinfo
dist/
build/
out/
coverage/
.nyc_output/
.env
.env.*
!.env.example
!.env.sample`,
  },
  {
    id: "nextjs",
    label: "Next.js",
    short: "App Router, Vercel output",
    body: `.next/
out/
next-env.d.ts
.vercel
*.pem`,
  },
  {
    id: "vue",
    label: "Vue / Vite",
    short: "Vite dist and local env",
    body: `dist/
dist-ssr/
*.local
.vite/`,
  },
  {
    id: "python",
    label: "Python",
    short: "venv, bytecode, caches",
    body: `__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
.venv/
venv/
ENV/
env/
.pytest_cache/
.mypy_cache/
.ruff_cache/
.ipynb_checkpoints/
*.cover
.hypothesis/
.pytype/
cython_debug/`,
  },
  {
    id: "rust",
    label: "Rust",
    short: "Cargo build output",
    body: `/target/
debug/
release/
**/*.rs.bk
*.pdb`,
  },
  {
    id: "go",
    label: "Go",
    short: "binaries and vendor (optional)",
    body: `*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
vendor/
bin/`,
  },
  {
    id: "java",
    label: "Java / Gradle / Maven",
    short: "class files, build dirs",
    body: `*.class
*.jar
*.war
*.ear
*.nar
hs_err_pid*
replay_pid*
.gradle/
build/
!gradle/wrapper/gradle-wrapper.jar
!**/src/main/**/build/
!**/src/test/**/build/
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar`,
  },
  {
    id: "ruby",
    label: "Ruby / Rails",
    short: "bundler, logs, tmp",
    body: `/.bundle/
/vendor/bundle
/log/*
/tmp/*
!/log/.keep
!/tmp/.keep
*.gem
*.rbc
/.config
/coverage/
/InstalledFiles
/pkg/
/spec/reports/
/spec/examples.txt
/test/tmp/
/test/version_tmp/
/tmp/
.byebug_history
dump.rdb`,
  },
  {
    id: "php",
    label: "PHP / Composer",
    short: "vendor and local phpunit",
    body: `/vendor/
composer.phar
.phpunit.result.cache
.php_cs.cache
.php-cs-fixer.cache`,
  },
  {
    id: "dotnet",
    label: ".NET / C#",
    short: "bin, obj, user files",
    body: `bin/
obj/
[Bb]in/
[Oo]bj/
[Ll]og/
[Ll]ogs/
*.user
*.suo
*.userosscache
*.sln.docstates
[Dd]ebug/
[Rr]elease/
x64/
x86/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Bb]uild/
*.dbmdl
*.dbproj.schemaview
*.jfm
*.pfx
*.publishsettings
orleans.codegen.cs`,
  },
  {
    id: "terraform",
    label: "Terraform",
    short: "state and plugin cache",
    body: `.terraform/
*.tfstate
*.tfstate.*
crash.log
crash.*.log
override.tf
override.tf.json
*_override.tf
*_override.tf.json
.terraformrc
terraform.rc`,
  },
  {
    id: "docker",
    label: "Docker (local)",
    short: "compose overrides, secrets",
    body: `*.log
docker-compose.override.yml
.dockerignore.local
.env.docker`,
  },
  {
    id: "kubernetes",
    label: "Kubernetes (local)",
    short: "kubeconfig backups",
    body: `*.kubeconfig.local
kubeconfig.local.yaml`,
  },
  {
    id: "vscode",
    label: "Visual Studio Code",
    short: "workspace settings (selective keep)",
    body: `.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/*.code-snippets
.history/`,
  },
  {
    id: "jetbrains",
    label: "JetBrains IDEs",
    short: "IntelliJ, WebStorm, etc.",
    body: `.idea/
*.iml
*.iws
*.ipr
out/`,
  },
  {
    id: "swift-xcode",
    label: "Swift / Xcode",
    short: "DerivedData, user data",
    body: `DerivedData/
*.xcuserstate
*.xcscmblueprint
*.xccheckout
*.moved-aside
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata/
*.hmap
*.ipa
*.dSYM.zip
*.dSYM
build/
Carthage/Build/`,
  },
  {
    id: "flutter",
    label: "Flutter / Dart",
    short: "pub cache markers, build",
    body: `.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
.pub-cache/
.pub/
build/
**/doc/api/`,
  },
  {
    id: "c-cpp",
    label: "C / C++",
    short: "objects, CMake build dirs",
    body: `*.o
*.obj
*.lo
*.slo
*.a
*.la
*.lai
*.so
*.dll
*.dylib
*.exe
CMakeCache.txt
CMakeFiles/
cmake_install.cmake
Makefile
build/
cmake-build-*/
out/`,
  },
];

const ORDER_INDEX: Record<GitignoreTemplateId, number> = Object.fromEntries(
  [
    "macos",
    "windows",
    "linux",
    "vscode",
    "jetbrains",
    "node",
    "nextjs",
    "vue",
    "python",
    "rust",
    "go",
    "java",
    "ruby",
    "php",
    "dotnet",
    "swift-xcode",
    "flutter",
    "c-cpp",
    "terraform",
    "docker",
    "kubernetes",
  ].map((id, i) => [id, i]),
) as Record<GitignoreTemplateId, number>;

export function mergeGitignoreTemplates(ids: Iterable<GitignoreTemplateId>): string {
  const unique = new Set(ids);
  const sorted = [...unique].sort(
    (a, b) => (ORDER_INDEX[a] ?? 99) - (ORDER_INDEX[b] ?? 99),
  );
  if (sorted.length === 0) {
    return `# Select stacks on the left, or upload an existing .gitignore.\n`;
  }
  const header = `# Combined .gitignore — generated online; review before commit.\n# https://git-scm.com/docs/gitignore\n\n`;
  const blocks = sorted.map((id) => {
    const meta = GITIGNORE_TEMPLATE_LIST.find((t) => t.id === id);
    if (!meta) return "";
    return `# --- ${meta.label} ---\n${meta.body.trim()}`;
  });
  return header + blocks.filter(Boolean).join("\n\n") + "\n";
}
