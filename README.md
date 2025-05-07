![image](https://github.com/user-attachments/assets/e5853e3b-6c7c-4adc-9a26-9b1177fa1b05)

# FemBoys United

**FemBoys United** is a curated directory of online spaces where femboys and allies can connect, share, and express themselves. Whether you're looking for the best advice, supportive communities, or stylish and affordable outfit ideas, **FemBoys United** has got you covered!

---

## 💡 What is FemBoys United?

**FemBoys United** is an online resource designed to provide femboys and their allies with a space to discover various online communities, resources, and support. It aggregates curated links to the best Discord servers, advice forums, social groups, and fashion resources that celebrate the femboy aesthetic. The site aims to make it easier for people to find spaces that align with their identity and interests.

---

## 🎯 Why was it created?

I noticed that there’s a lack of centralized spaces for femboys and allies to easily discover supportive communities and spaces online. Many great resources are scattered across the web, but they’re often hard to find or don’t have a clear connection to other related spaces. 

The goal of **FemBoys United** is to create a curated directory that brings together these resources in one place, making it easier for femboys and allies to connect, support one another, and discover new ways to express themselves.

---

## 👥 Who is it for?

This site is for:

- **Femboys** looking for advice, communities, and inspiration for expressing their identity.
- **Allies** who want to support the femboy community and find social spaces to engage.
- **Anyone** looking to learn more about the femboy lifestyle, style tips, and helpful resources.

Whether you’re just starting your journey or have been part of the community for a while, there’s something for everyone!

---

## 🛠️ How it works

The site works by providing a curated list of online spaces:

1. **Categories**: Each type of resource (e.g., advice, fashion tips, supportive communities) is organized into categories.
2. **Links**: Clicking on any listed resource will take you directly to the online space, whether it’s a Discord server, a social platform, or an advice blog.
3. **Filters**: Users can filter results based on preferences, such as NSFW content, to make the experience more personalized.
4. **Search**: A built-in search bar allows users to quickly find specific products based on keywords.

The website’s interface is simple, clean, and designed for easy navigation, helping users quickly access what they need.

---

## 🚀 How it's hosted

**FemBoys United** is hosted on **Cloudflare Pages**, using the **[Cloudflare Pages](https://pages.cloudflare.com/)** service. This means that it’s free to use and maintain, and the source code is available for anyone to review and contribute to.

### Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Hosting**: Cloudflare Pages
- **Source Code**: [GitHub Repository](https://github.com/FemBoysUnited/femboysunited)

---

## 🧩 How to Add Cards to FemBoys United

Adding new cards to the site is easy! Cards are stored as individual `.txt` files in category-specific folders, and listed in `cards.json` to be loaded by the site dynamically.

### 📂 Folder Structure

Each category has its own folder:
```
/discords → Cards for the Discords page

/products → Cards for the Products page

/socials → Cards for the Socials page

cards.json → Master list of all cards used by the site
```

---

### 📝 Example Card Format (`example_card.txt`)

Each card should be written in JSON format and saved as a `.txt` file. Here's an example of a valid card:

```json
{
  "logo": "https://example.com/test.png",
  "name": "Example Title",
  "description": "Example Description",
  "link": "https://examplestore.com/item/example",
  "nsfw": false
}
```
### ⚠️ Important Notes:

File must end with `.txt`

JSON must be valid

nsfw must be either true or false

Use regular quotes (`"`) - not curly quotes (`“”`)

Make sure the link field and image field contains a full valid URL.

# 🗂️ Organizing Cards by Category
Place each card `.txt` file into its respective folder:


`/discords`	For Discord server listings

`/products`	For fashion and accessory links

`/socials`	For subreddits, forums, and communities

## 🧠 Link Cards in cards.json
After creating a `.txt file` in the appropriate folder, you **must** reference it in `cards.json`. This file is how the site knows what cards to load.

### ✅ cards.json Example:
```
{
  "socials": [
    "r-lgbt.txt",
    "r-feminineboys.txt",
    "r-femboySFW.txt",
    "r-femboysNSFW.txt"
  ],
  "discords": [
    "boykissercafe.txt",
    "femboy.txt",
    "cute18+.txt"
  ],
  "products": [
    "Blahaj.txt",
    "hoodie1.txt",
    "skirt1.txt"
  ]
}
```
✅ Filenames must match exactly

✅ Omit any blank entries

✅ Empty strings (`""`) will be ignored

# ✅ Summary
### Steps:
- 1️⃣	Create a .txt file with valid JSON content

- 2️⃣	Place it in the correct folder: cards/discords, cards/products, or cards/socials

- 3️⃣	Add the filename to the appropriate list in cards.json

---
## 📝 Contributing

If you want to contribute to **FemBoys United**, feel free to fork the repository and submit a pull request. Contributions can include:

- Adding new online spaces/resources.
- Improving the website’s design or functionality.
- Reporting bugs or suggesting new features.

You can also help by sharing the website with others or providing feedback on how it can be improved.

---

## 📬 Contact

For any questions, suggestions, or feedback, feel free to open an issue or reach out via the GitHub repository.

---

## 🌐 Visit the Site

You can visit **FemBoys United** here: [FemBoys United](https://femboysunited.pages.dev/)

---

## 🎉 Thank You

Thank you for checking out **FemBoys United**! I hope this directory helps you discover new communities and spaces where you can connect, share, and express yourself. Let’s build a supportive and inclusive space for all femboys and allies! 💖
