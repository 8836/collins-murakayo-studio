<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Blur tool: the AI model only returns normalised bounding boxes (`src/lib/blur.functions.ts`); blurring happens on a browser canvas so pixels outside the boxes are never altered. Why: generative image edits subtly change the whole design.
- Client artwork with contact details is published only as pre-blurred `*-blurred.asset.json` copies. Why: client privacy.
