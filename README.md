i18next-extractor
=================
_i18next-extractor_ là một công cụ extract ngôn ngữ dành cho ứng dụng React sử dụng bộ `i18next`.

# Các định nghĩa cơ bản

## Translation Value

Một **translation value** là một giá trị được hiển thị trên màn hình cho người dùng đọc được. Ví dụ: chữ hiển thị trong nút "Đăng nhập", chữ hiển thị trong ô "Tìm kiếm", ...

## Translation Key

Translation key gồm 2 phần:
- `namespace`: namespace được sử dụng để gom nhóm các key thuộc cùng một domain của ứng dụng. Tất cả các **translation key** thuộc một namespace sẽ được gom nhóm lại thành một file json. Một namespace có thể chứa các namespace con và namespace gốc sẽ được dùng để đặt tên cho file đó.
- `key`: key là giá trị duy nhất được đại diện cho một **translation value** thuộc nhiều ngôn ngữ khác nhau. Mỗi key sẽ phải nằm trong một **namespace** nào đó.

## Cách đặt translation key

- Tại mỗi vị trí cần hiển thị văn bản theo ngôn ngữ tương ứng cho người dùng đọc được, lấy domain của ứng dụng làm **namespace**, xem xét xem có cần thiết tạo thêm **namespace** con hay không, rồi dùng một từ khóa duy nhất để làm **translation key**

- Đánh dấu **translation key** này bằng cú pháp sau:

```typescript
import {translate} from 'react3l-core/helpers/internationalization';

// ...

translate('namespace.subNamespace.translationKey');

// ...
```

- Có thể truyền params vào để sử dụng:

```typescript
translate('namespace.subNamespace.translationKey', {param1: value1, param2: value2});
translate('namespace.subNamespace.translationKey', params);
```
Lưu ý:
- do những hạn chế của biểu thức đánh dấu key, phần tham số thứ hai không nên chứa các ký tự `)`, `(`, `'`.
- nếu trong thư mục mã nguồn đã xuất hiện cụm 'abc.def' là namespace, thì nó không được phép xuất hiện dưới dạng key.
  Ví dụ: nếu có `translate('product.detail.name')` rồi thì không được phép có `translate('product.detail')`

# Command line interface

```bash
Usage: react-i18next-extract [options] [command]

Translate your application using i18next

  react-i18next-extract merge [...options]

  react-i18next-extract extract [...options]


Options:
  -V, --version                        output the version number
  -i, --input <inputPath>              Input path (default: "./src/")
  -o, --output <outputPath>            Output path (default: "./public/assets/i18n/")
  -p, --partials <partialPath>         Partial path (default: "./public/assets/i18n/partials/")
  -ic, --include <include>             Include pattern (default: "\\.(js|jsx|ts|tsx)$")
  -ex, --exclude <exclude>             Exclude pattern (default: "\\.(spec|test)\\.(js|jsx|ts|tsx)$")
  -ks, --key-separator <keySeparator>  Key separator (default: ".")
  -is, --indent-size <indent>          Indent size (default: 2)
  -l, --languages <languages...>       Supported languages (default: ["en","vi"])
  -m, --marker <marker>                Translate marker (default: "translate")
  -h, --help                           output usage information

Commands:
  extract [options]                    Extract all translations from your source code
  merge [options]                      Merge all translations for each language into a single JSON file
```
